"use client";

import type {
  AvailabilityResult,
  CreateReservationInput,
  CreateReservationResult,
} from "@ember-and-oak/types";
import { useEffect, useRef, useState } from "react";

import { createReservation, searchAvailability } from "../_lib/reservation-api";
import { asReservationApiError, ReservationApiError } from "../_lib/reservation-errors";
import type { PendingReservationRequest, ReservationStep } from "../_lib/reservation-flow-state";
import { sameLogicalRequest } from "../_lib/reservation-flow-state";
import { restaurantToday } from "../_lib/reservation-format";
import { createIdempotencyKey } from "../_lib/reservation-idempotency";
import { AvailabilityResults } from "./availability-results";
import { GuestDetailsForm, type GuestDetails } from "./guest-details-form";
import { ReservationConfirmation } from "./reservation-confirmation";
import { ReservationProgress } from "./reservation-progress";
import { ReservationSearchForm, type ReservationSearchInput } from "./reservation-search-form";
import { ReservationSlotList } from "./reservation-slot-list";
import { ReservationSummary } from "./reservation-summary";

const emptyGuest: GuestDetails = { name: "", email: "", phone: "", specialRequest: "" };

export function ReservationFlow() {
  const [step, setStep] = useState<ReservationStep>("SEARCH");
  const [search, setSearch] = useState<ReservationSearchInput>(() => ({
    date: restaurantToday(),
    guestCount: 2,
  }));
  const [availability, setAvailability] = useState<AvailabilityResult | null>(null);
  const [availabilityError, setAvailabilityError] = useState<ReservationApiError | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [guest, setGuest] = useState<GuestDetails>(emptyGuest);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [conflictMessage, setConflictMessage] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<CreateReservationResult | null>(null);
  const searchController = useRef<AbortController | null>(null);
  const pendingRequest = useRef<PendingReservationRequest | null>(null);
  const submitting = useRef(false);
  const slotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => searchController.current?.abort(), []);

  function changeSearch(value: ReservationSearchInput) {
    searchController.current?.abort();
    setSearch(value);
    setAvailability(null);
    setAvailabilityError(null);
    setSelectedSlot(null);
    setConflictMessage(null);
    setSubmitError(null);
    pendingRequest.current = null;
    setStep("SEARCH");
  }

  async function runSearch(value: ReservationSearchInput, fromConflict = false) {
    searchController.current?.abort();
    const controller = new AbortController();
    searchController.current = controller;
    setAvailabilityError(null);
    setStep("SEARCHING");
    try {
      const result = await searchAvailability(value.date, value.guestCount, controller.signal);
      if (controller.signal.aborted) return;
      setAvailability(result);
      setSelectedSlot(null);
      setStep("AVAILABILITY");
      if (fromConflict) {
        requestAnimationFrame(() =>
          slotsRef.current
            ?.querySelector<HTMLInputElement>('input[type="radio"]:not(:disabled)')
            ?.focus(),
        );
      }
    } catch (error) {
      if (controller.signal.aborted) return;
      setAvailability(null);
      setAvailabilityError(asReservationApiError(error));
      setStep("SEARCH");
    }
  }

  function chooseSlot(startTime: string) {
    setSelectedSlot(startTime);
    setConflictMessage(null);
    setSubmitError(null);
    pendingRequest.current = null;
    setStep("GUEST_DETAILS");
    requestAnimationFrame(() => document.getElementById("reservation-name")?.focus());
  }

  function changeGuest(value: GuestDetails) {
    setGuest(value);
    setSubmitError(null);
    pendingRequest.current = null;
  }

  async function submit() {
    if (submitting.current || !selectedSlot) return;
    submitting.current = true;
    const input: CreateReservationInput = {
      date: search.date,
      startTime: selectedSlot,
      guestCount: search.guestCount,
      guest: { name: guest.name, email: guest.email, phone: guest.phone },
      ...(guest.specialRequest.trim() ? { specialRequest: guest.specialRequest } : {}),
    };
    const serializedBody = JSON.stringify(input);
    if (!sameLogicalRequest(pendingRequest.current, serializedBody)) {
      pendingRequest.current = { key: createIdempotencyKey(), serializedBody };
    }
    const key = pendingRequest.current!.key;
    setSubmitError(null);
    setStep("SUBMITTING");
    try {
      const result = await createReservation(input, key);
      setConfirmation(result);
      setStep("CONFIRMED");
    } catch (error) {
      const apiError = asReservationApiError(error);
      if (apiError.code === "SLOT_CONFLICT" || apiError.code === "NO_AVAILABILITY") {
        pendingRequest.current = null;
        setSelectedSlot(null);
        setConflictMessage(apiError.message);
        await runSearch(search, true);
      } else if (
        [
          "CLOSED",
          "SPECIAL_CLOSURE",
          "OUTSIDE_BOOKING_WINDOW",
          "SAME_DAY_CUTOFF",
          "PARTY_TOO_LARGE",
        ].includes(apiError.code)
      ) {
        pendingRequest.current = null;
        setSelectedSlot(null);
        setAvailability(null);
        setAvailabilityError(apiError);
        setStep("SEARCH");
      } else {
        if (apiError.code === "IDEMPOTENCY_CONFLICT") pendingRequest.current = null;
        setSubmitError(apiError.message);
        setStep("GUEST_DETAILS");
      }
    } finally {
      submitting.current = false;
    }
  }

  return (
    <div className="reservation-flow">
      <ReservationProgress step={step} />
      {step === "CONFIRMED" && confirmation ? (
        <ReservationConfirmation result={confirmation} guest={guest} />
      ) : (
        <>
          <ReservationSearchForm
            value={search}
            onChange={changeSearch}
            onSearch={(value) => void runSearch(value)}
            disabled={step === "SEARCHING" || step === "SUBMITTING"}
            {...(availabilityError?.code === "VALIDATION_ERROR"
              ? { error: availabilityError.message }
              : {})}
          />
          <div className="reservation-flow__body">
            <div className="reservation-flow__main">
              {conflictMessage ? (
                <p className="reservation-notice" role="alert">
                  {conflictMessage}
                </p>
              ) : null}
              {step !== "CONFIRMED" ? (
                <div ref={slotsRef}>
                  <AvailabilityResults
                    result={availability}
                    loading={step === "SEARCHING"}
                    error={availabilityError}
                    onRetry={() => void runSearch(search)}
                  >
                    {step === "AVAILABILITY" ||
                    step === "GUEST_DETAILS" ||
                    step === "SUBMITTING" ? (
                      <ReservationSlotList
                        slots={availability?.slots ?? []}
                        selected={selectedSlot}
                        onSelect={chooseSlot}
                        disabled={step === "SUBMITTING"}
                      />
                    ) : null}
                  </AvailabilityResults>
                </div>
              ) : null}
              {(step === "GUEST_DETAILS" || step === "SUBMITTING") && selectedSlot ? (
                <GuestDetailsForm
                  value={guest}
                  onChange={changeGuest}
                  onSubmit={() => void submit()}
                  date={search.date}
                  startTime={selectedSlot}
                  guestCount={search.guestCount}
                  submitting={step === "SUBMITTING"}
                  serverError={submitError}
                />
              ) : null}
            </div>
            <ReservationSummary
              date={search.date}
              guestCount={search.guestCount}
              startTime={selectedSlot}
            />
          </div>
        </>
      )}
    </div>
  );
}
