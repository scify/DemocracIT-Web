package model.dtos

/**
 * Created by pisaris on 9/7/2015.
 */
case class RelevantLaws (id: Long,
                             article_id:Int,
                             pdf_url:String,
                             entity_type:String,
                             entity_text:String,
                             consultation_id: Long
                             );

