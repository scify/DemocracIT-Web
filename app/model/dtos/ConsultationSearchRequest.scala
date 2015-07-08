package model.dtos

case  class ConsultationSearchRequest(statusId: Byte,
                                query: String,
                                ministryId: Byte)
