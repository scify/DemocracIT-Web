package forms

import play.api.data.Form
import play.api.data.Forms._


object AnnotationForm {

  val form = Form(
    mapping(
      "consultationId" -> longNumber,
      "articleId" -> longNumber,
      "body" -> text,
      "annTagId" -> number,
      "annotatedText" -> text,
      "discussionThreadId" ->number

    )(AnnotationViewModel.apply)(AnnotationViewModel.unapply)
  )

  case class AnnotationViewModel(
    consultationId: Long,
    articleId:Long,
    body:String,
    annTagId:Int,
    annotatedText: String,
    discussionThreadId: Int
    )
}
