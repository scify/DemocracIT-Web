package model


class ConsultationSearchRequest(val statusId: Byte,
                                val query: String,
                                var ministryId: Byte)
