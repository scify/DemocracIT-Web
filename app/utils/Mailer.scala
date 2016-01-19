package utils


import model.viewmodels.forms.SignInForm.SignUpData
import play.api.Play.current
import play.api.i18n.Messages
import play.api.i18n.Messages.Implicits._
import play.twirl.api.Html
import utils.MailService

import scala.language.implicitConversions

object Mailer {

  implicit def html2String (html: Html): String = html.toString

  def welcome (signUpData: SignUpData, link: String)(implicit mailService:MailService) {
    mailService.sendEmailAsync(signUpData.email)(
      subject = Messages("mail.welcome.subject"),
      bodyHtml = link,
      bodyText = link
    )
  }

  def forgotPassword (email: String, link: String)(implicit mailService:MailService) {
    mailService.sendEmailAsync(email)(
      subject = Messages("mail.forgotpwd.subject"),
      bodyHtml = link,
      bodyText = link
    )
  }

  def forgotPasswordUnknowAddress (email: String)(implicit mailService:MailService) {

    def getText()(implicit messages: Messages): String = {
      views.html.emails.unknownEmail.render(messages)
    }

    mailService.sendEmailAsync(email)(
      subject = Messages("mail.forgotpwd.subject"),
      bodyHtml = views.html.emails.unknownEmail.apply(),
      bodyText = getText()
    )
  }
}
