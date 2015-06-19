package model.dtos

case class OrganizationStatsGrouped( val orderId:Int, val category:String, stats:List[OrganizationStats])
