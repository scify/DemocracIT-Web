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
      "userAnnotatedText" -> text , //the user user annotated
      "discussionThreadId" -> number ,
      "discussionThreadClientId" -> text ,
      "discussionThreadText" -> text
    )(AnnotationViewModel.apply)(AnnotationViewModel.unapply)
  )

  case class AnnotationViewModel(
          consultationId: Long,
          articleId:Long,
          body:String,
          annotationTagId:Int,
          userAnnotatedText: String,
          discussionThreadId: Int,
          discussionThreadClientId:String,
          discusionThreadText:String
    )
}
