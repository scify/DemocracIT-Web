package model.dtos

case class ConsFrequencyPerOrganization (date:String, organizationName:String, organizationId:Long, numberOfConsultations: Int, groupTitle:Option[String], cons_ids:String)
