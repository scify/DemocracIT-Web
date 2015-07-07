package model.dtos

import java.util.{Calendar, Date, Locale}

case class ConsultationStats(consultationId:Long,
                             numberOfArticles:Int,
                             numberOfComments:Int,
                             daysActive:Int,
                             var isActive:Boolean,
                             organizationId:Byte,
                             organizationTitle:String,
                             organizationCategory:String,
                             organizationOrder:Int)

