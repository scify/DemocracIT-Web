package model.dtos

import java.util.UUID

//TODO: add comment
case class FinalLawUserAnnotation (userId:UUID, userName:String, commentId:Long, var annotationIds:List[String]=Nil)
