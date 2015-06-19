package model.dtos

case class OrganizationStats(val id:Int,
                             val title:String,
                             val category:String,
                             val categDisplayOrder:Int,
                             val consultationCount:Int,
                             val activeConsultations:Int,
                             val medianAverageComments:Int,
                             val medianAverageDays:Int)