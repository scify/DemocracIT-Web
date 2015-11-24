package model.dtos

/**
 * Created by pisaris on 24/11/2015.
 */
case class ConsultationForEvaluation (id:Long, start_date:String, end_date:String, title:String, short_description:String, organization_id:Long, opengov_url:String, completed:Int, num_of_articles:Int)
