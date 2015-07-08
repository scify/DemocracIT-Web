package model.dtos

case class OrganizationStats(id:Int,
                             title:String,
                             category:String,
                             categDisplayOrder:Int,
                             consultationCount:Int,
                             activeConsultations:Int,
                             medianAverageComments:Int,
                             medianAverageDays:Int)