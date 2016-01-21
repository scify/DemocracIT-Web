package model.viewmodels.forms

import play.api.data.Form
import play.api.data.Forms._


object AnnotationForm {

  val form = Form(
    mapping(
      "consultationId" -> longNumber,
      "articleId" -> longNumber,
      "body" -> text ,
      "userAnnotatedText" -> optional(text), //the user user annotated
      "discussionthreadid" -> optional(longNumber),
      "discussionthreadclientid" -> text ,
      "discussionthreadtypeid" -> number,
      "discussionThreadText" -> text,
      "annotationTagTopics" -> seq(
        mapping(
          "text" -> text,
          "value" -> optional(longNumber)
        )(AnnotationTagFormModel.apply)(AnnotationTagFormModel.unapply)
      ) ,
      "annotationTagProblems" -> seq(
        mapping(
          "text" -> text,
          "value" -> optional(longNumber)
        )(AnnotationTagFormModel.apply)(AnnotationTagFormModel.unapply)
      ),
      "emotionId" ->optional(number)
    )(AnnotationFormModel.apply)(AnnotationFormModel.unapply)
  )

  case class AnnotationTagFormModel(text:String,value:Option[Long])

  case class AnnotationFormModel(
          consultationId: Long,
          articleId:Long,
          body:String,
          userAnnotatedText: Option[String],
          discussionThreadId: Option[Long],
          discussionThreadClientId:String,
          discussionThreadTypeId:Int,
          discusionThreadText:String,
          annotationTagTopics:Seq[AnnotationTagFormModel],
          annotationTagProblems:Seq[AnnotationTagFormModel],
          emotionId:Option[Int]
    )
}
