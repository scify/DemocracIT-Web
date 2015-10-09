package model.dtos

case  class ConsultationSearchRequest(statusId: Byte,
                               var query: String,
                                ministryId: Byte)
