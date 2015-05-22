package controllers

import javax.inject.{Inject, Singleton}

import com.mohiva.play.silhouette.api.{Silhouette, Environment}
import com.mohiva.play.silhouette.impl.authenticators.SessionAuthenticator
import forms._
import play.api.libs.json.{Json, JsValue, JsPath, Writes}
import utils.ImplicitWrites.FormErrorWrites

class AnnotationController @Inject() (implicit val env: Environment[model.User, SessionAuthenticator]) extends Silhouette[model.User, SessionAuthenticator] {

  def annotatePost() =  UserAwareAction { implicit request =>
    //request.identity contains an Option[User]
    AnnotationForm.form.bindFromRequest.fold(
     form => UnprocessableEntity(Json.toJson(form.errors)),
     value => {
       if (request.identity.isDefined)
         UnprocessableEntity(Json.toJson(-1)) //notify that he is not logged in. There must be a better way to handle this. Maybe using a trait?

       //todo: save to database and return result.
       Ok(Json.toJson("not saved"))
     }
    )

  }
}