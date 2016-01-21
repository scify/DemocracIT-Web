package model.dtos

case class ConsDurationsPerOrganization (organizationId:Long, organizationName:String, periods: String, numberOfConsultations: Int, groupTitle: Option[String], cons_ids:String)
