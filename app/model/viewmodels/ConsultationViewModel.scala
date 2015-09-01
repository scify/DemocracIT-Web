package model.viewmodels

import play.api.libs.json._
import model.dtos._
import utils.ImplicitReadWrites._

case class ConsultationViewModel(consultation:model.dtos.Consultation,
                                 annotationsRelatedToProblems: Seq[AnnotationTags],
                                 annotationsRelatedToTopics: Seq[AnnotationTags],
                                 discussionThreads : Seq[DiscussionThread],
                                 user: Option[model.User],
                                 relevantMaterials: Seq[RelevantMaterial],
                                 relevantLaws: Seq[RelevantLaws])
{
  private var _distinctLaws:Seq[RelevantLaws] = Nil

   //def annotationTypesToJson():String = Json.toJson(annotationsRelatedToProblems).toString()

  def discussionThreadsToJson():String =Json.toJson(discussionThreads).toString()
  def relevantLawsToJson():String =Json.toJson(this.distinctLaws(false)).toString()

  def distinctLaws(ignoreCharacters:Boolean = true):Seq[RelevantLaws] = {

    if (_distinctLaws ==Nil)
      {
        val grouppingFunction =if (ignoreCharacters)
          (x:RelevantLaws) => x.entity_text.toLowerCase().replace(" ","").replace(".","")
        else
          (x:RelevantLaws) => x.entity_text.toLowerCase()

        _distinctLaws  =this.relevantLaws.groupBy(grouppingFunction).map(tuple => tuple._2.head).toList
      }

    _distinctLaws

  }

  def groupLaws():Seq[(String, Seq[RelevantLaws])]  = {

    val results:Seq[(String, Seq[RelevantLaws])] = this.relevantLaws.groupBy( law => law.entity_law).toList
    results
  }

  def findOccurances(lawName:String):Int = {
    var i = 0
    for(law <- this.relevantLaws) {
      println(law.entity_law.toLowerCase().replace(" ","").replace(".",""))
      println("lawName: " + lawName.toLowerCase().replace(" ","").replace(".",""))
      if(law.entity_law.toLowerCase().replace(" ","").replace(".","") == lawName.toLowerCase().replace(" ","").replace(".","")) {
        i += 1
      }
    }
    i
  }

}

