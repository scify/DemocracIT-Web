package model.viewmodels.forms

import play.api.data.Form
import play.api.data.Forms._

/**
 * The form which handles the submission of the credentials.
 */
object SignInForm {

  /**
   * A play framework form.
   */
  val form = Form(
    mapping(
      "email" -> email,
      "password" -> nonEmptyText,
      "rememberMe" -> boolean,
      "returnUrl" -> optional(text)
    )(SignUpData.apply)(SignUpData.unapply)
  )

  /**
   * The form data.
   *
   * @param email The email of the user.
   * @param password The password of the user.
   * @param rememberMe Indicates if the user should stay logged in on the next visit.
   */
  case class SignUpData(
                   email: String,
                   password: String,
                   rememberMe: Boolean,
                   returnUrl:Option[String])
}
