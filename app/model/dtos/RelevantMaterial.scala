package model.dtos

/**
 * Created by pisaris on 3/7/2015.
 */
case class RelevantMaterial (val id: Long,
                             val title:String,
                             val consultationId:Long,
                             val source_url:String,
                             val pdf_url:String);
