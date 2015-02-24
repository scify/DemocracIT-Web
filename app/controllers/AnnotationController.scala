package controllers

import javax.inject.{Inject, Singleton}

import play.api.mvc._
import services.TextGenerator


class AnnotationController() extends Controller {

  def annotate(consultationid:Int, tagId:Int) = Action {
    Ok("not implemented")
  }

}