# Admin role matrix

| Capability                           | ADMIN | HOST | CONTENT_EDITOR |
| ------------------------------------ | ----: | ---: | -------------: |
| Reservation list/detail              |   Yes |  Yes |             No |
| Status, cancellation, internal notes |   Yes |  Yes |             No |
| Menu and editorial content           |   Yes |   No |            Yes |
| Media references and metadata        |   Yes |   No |            Yes |
| Opening hours and closures           |   Yes |   No |             No |

Navigation visibility is only a usability feature. API session and role guards are the security
boundary, and roles are always loaded from the database.
