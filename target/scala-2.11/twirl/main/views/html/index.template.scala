
package views.html

import play.twirl.api._
import play.twirl.api.TemplateMagic._

import play.api.templates.PlayMagic._
import models._
import controllers._
import play.api.i18n._
import play.api.mvc._
import play.api.data._
import views.html._

/**/
object index extends BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with play.twirl.api.Template1[String,play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply/*1.2*/(message: String):play.twirl.api.HtmlFormat.Appendable = {
      _display_ {

Seq[Any](format.raw/*1.19*/("""

"""),_display_(/*3.2*/main("DemocracIT")/*3.20*/ {_display_(Seq[Any](format.raw/*3.22*/("""

    """),format.raw/*5.5*/("""<h2>Welcome to democracIT</h2>


""")))}),format.raw/*8.2*/("""
"""))}
  }

  def render(message:String): play.twirl.api.HtmlFormat.Appendable = apply(message)

  def f:((String) => play.twirl.api.HtmlFormat.Appendable) = (message) => apply(message)

  def ref: this.type = this

}
              /*
                  -- GENERATED --
                  DATE: Fri Feb 13 18:32:36 EET 2015
                  SOURCE: /home/alex/Projects/democracit/web/app/views/index.scala.html
                  HASH: cb3a3803372fbc41026e8b4494547a634aaeb240
                  MATRIX: 505->1|610->18|638->21|664->39|703->41|735->47|798->81
                  LINES: 19->1|22->1|24->3|24->3|24->3|26->5|29->8
                  -- GENERATED --
              */
          