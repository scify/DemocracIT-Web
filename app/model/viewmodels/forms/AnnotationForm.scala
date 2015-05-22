package forms

import play.api.data.Form
import play.api.data.Forms._


object AnnotationForm {

  val form = Form(
    mapping(
      "consultationId" -> longNumber,
      "articleId" -> longNumber,
      "tagId" -> number,
      "text" -> nonEmptyText,
      "comment" -> nonEmptyText,
      "startIndex" -> number,
      "endIndex" -> number
    )(AnnotationViewModel.apply)(AnnotationViewModel.unapply)
  )

  case class AnnotationViewModel(
    consultationId: Long,
    articleId:Long,
    tagId:Int,
    text: String,
    comment: String,
    startIndex:Int,
    endIndex:Int)
}
