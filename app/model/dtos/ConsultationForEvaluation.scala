package model.dtos

import java.util.Date

case class ConsultationForEvaluation (id:Long, start_date:Date, end_date:Date, title:String, short_description:String, organization_id:Long, opengov_url:String, completed:Int, num_of_articles:Int)
