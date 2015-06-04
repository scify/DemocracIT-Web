package model.dtos

case class OrganizationPerCategory(val category:String, stats:List[OrganizationStats])

case class PlatformStats(val totalConsultations:Int, val organizationsPerCategory:List[OrganizationPerCategory])

