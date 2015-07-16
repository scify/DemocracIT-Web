package forms

import play.api.data.Form
import play.api.data.Forms._


object AnnotationForm {

  val form = Form(
    mapping(
      "consultationId" -> longNumber,
      "articleId" -> longNumber,
      "body" -> text ,
      "annotationTagId" -> number ,//the id from the select box
      "annotationTagText" -> text,//the text from the select box
      "userAnnotatedText" -> optional(text), //the user user annotated
      "discussionthreadid" -> optional(longNumber),
      "discussionthreadclientid" -> text ,
      "discussionThreadText" -> text
    )(AnnotationViewModel.apply)(AnnotationViewModel.unapply)
  )

  case class AnnotationViewModel(
          consultationId: Long,
          articleId:Long,
          body:String,
          annotationTagId:Int,
          annotationTagText:String,
          userAnnotatedText: Option[String],
          discussionThreadId: Option[Long],
          discussionThreadClientId:String,
          discusionThreadText:String
    )
}
