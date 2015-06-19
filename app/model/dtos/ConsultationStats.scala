package model.dtos

import java.util.{Calendar, Date, Locale}

case class ConsultationStats(val consultationId:Long,
                             val numberOfArticles:Int,
                             val numberOfComments:Int,
                             val daysActive:Int,
                             var isActive:Boolean,
                             val organizationId:Byte,
                             val organizationTitle:String,
                             val organizationCategory:String,
                             val organizationOrder:Int)

