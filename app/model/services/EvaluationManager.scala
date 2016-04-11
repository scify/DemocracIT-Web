package model.services

import model.dtos.User
import model.repositories.EvaluationRepository
import model.viewmodels.EvaluationViewModel
import play.api.i18n.{Messages}


class EvaluationManager() {

    def get(user:Option[User]): EvaluationViewModel= {
      val evaluationRepository = new EvaluationRepository()
      val dateSet = """
                      select to_char(CURRENT_DATE, 'YYYY/MM') as date union
                      select to_char(CURRENT_DATE - INTERVAL '1 months', 'YYYY/MM') as date union
                      select to_char(CURRENT_DATE - INTERVAL '2 months', 'YYYY/MM') as date union
                      select to_char(CURRENT_DATE - INTERVAL '3 months', 'YYYY/MM') as date union
                      select to_char(CURRENT_DATE - INTERVAL '4 months', 'YYYY/MM') as date union
                      select to_char(CURRENT_DATE - INTERVAL '5 months', 'YYYY/MM') as date union
                      select to_char(CURRENT_DATE - INTERVAL '6 months', 'YYYY/MM') as date union
                      select to_char(CURRENT_DATE - INTERVAL '7 months', 'YYYY/MM') as date union
                      select to_char(CURRENT_DATE - INTERVAL '8 months', 'YYYY/MM') as date union
                      select to_char(CURRENT_DATE - INTERVAL '9 months', 'YYYY/MM') as date union
                      select to_char(CURRENT_DATE - INTERVAL '10 months', 'YYYY/MM') as date union
                      select to_char(CURRENT_DATE - INTERVAL '11 months', 'YYYY/MM') as date union
                      select to_char(CURRENT_DATE - INTERVAL '12 months', 'YYYY/MM') as date union
                      select to_char(CURRENT_DATE - INTERVAL '13 months', 'YYYY/MM') as date union
                      select to_char(CURRENT_DATE - INTERVAL '14 months', 'YYYY/MM') as date union
                      select to_char(CURRENT_DATE - INTERVAL '15 months', 'YYYY/MM') as date union
                      select to_char(CURRENT_DATE - INTERVAL '16 months', 'YYYY/MM') as date union
                      select to_char(CURRENT_DATE - INTERVAL '17 months', 'YYYY/MM') as date"""


      EvaluationViewModel(user = user, evaluationRepository.getConsultationCommentsPerMonth(dateSet))
    }

  def getEvaluationPerOrganization(): List[model.dtos.ConsFrequencyPerOrganization] = {
    val evaluationRepository = new EvaluationRepository()
    var frequencies:List[model.dtos.ConsFrequencyPerOrganization] = Nil
    val dateSet = """
                    select to_char(CURRENT_DATE, 'YYYY/MM') as date union
                    select to_char(CURRENT_DATE - INTERVAL '1 months', 'YYYY/MM') as date union
                    select to_char(CURRENT_DATE - INTERVAL '2 months', 'YYYY/MM') as date union
                    select to_char(CURRENT_DATE - INTERVAL '3 months', 'YYYY/MM') as date union
                    select to_char(CURRENT_DATE - INTERVAL '4 months', 'YYYY/MM') as date union
                    select to_char(CURRENT_DATE - INTERVAL '5 months', 'YYYY/MM') as date union
                    select to_char(CURRENT_DATE - INTERVAL '6 months', 'YYYY/MM') as date union
                    select to_char(CURRENT_DATE - INTERVAL '7 months', 'YYYY/MM') as date union
                    select to_char(CURRENT_DATE - INTERVAL '8 months', 'YYYY/MM') as date union
                    select to_char(CURRENT_DATE - INTERVAL '9 months', 'YYYY/MM') as date union
                    select to_char(CURRENT_DATE - INTERVAL '10 months', 'YYYY/MM') as date union
                    select to_char(CURRENT_DATE - INTERVAL '11 months', 'YYYY/MM') as date union
                    select to_char(CURRENT_DATE - INTERVAL '12 months', 'YYYY/MM') as date union
                    select to_char(CURRENT_DATE - INTERVAL '13 months', 'YYYY/MM') as date union
                    select to_char(CURRENT_DATE - INTERVAL '14 months', 'YYYY/MM') as date union
                    select to_char(CURRENT_DATE - INTERVAL '15 months', 'YYYY/MM') as date union
                    select to_char(CURRENT_DATE - INTERVAL '16 months', 'YYYY/MM') as date union
                    select to_char(CURRENT_DATE - INTERVAL '17 months', 'YYYY/MM') as date"""
    frequencies = evaluationRepository.getEvaluationPerOrganization(dateSet)
    frequencies
  }
  def getConsDurationPerOrganization()(implicit messages: Messages): List[model.dtos.ConsDurationsPerOrganization] = {
    val evaluationRepository = new EvaluationRepository()
    var durations: List[model.dtos.ConsDurationsPerOrganization] = Nil
    durations = evaluationRepository.getConsDurationPerOrganization()
    for(duration <- durations) {
      val periodTranslated = duration.periods match {
        case "LESS_THAN_5" => messages("LESS_THAN_5")
        case "6_TO_10" => messages("6_TO_10")
        case "11_TO_15" => messages("11_TO_15")
        case "16_TO_20" => messages("16_TO_20")
        case "21_TO_30" => messages("21_TO_30")
        case "31_TO_50" => messages("31_TO_50")
        case "MORE_THAN_50" => messages("MORE_THAN_50")
        case _  => "Invalid duration"
      }
      duration.periods = periodTranslated
    }
    durations
  }

  def getConsFinalLawStats(): List[model.dtos.ConsultationFinalLawStats] = {
    val evaluationRepository = new EvaluationRepository()
    var consFinalLawStats: List[model.dtos.ConsultationFinalLawStats] = Nil
    consFinalLawStats = evaluationRepository.getConsultationFinalLawStats()
    consFinalLawStats
  }

  def getConsDuration()(implicit messages: Messages): List[model.dtos.ConsDurations] = {
    val evaluationRepository = new EvaluationRepository()
    var durations: List[model.dtos.ConsDurations] = Nil
    durations = evaluationRepository.getConsDuration()
    for(duration <- durations) {
      val periodTranslated = duration.periods match {
        case "LESS_THAN_5" => messages("LESS_THAN_5")
        case "6_TO_10" => messages("6_TO_10")
        case "11_TO_15" => messages("11_TO_15")
        case "16_TO_20" => messages("16_TO_20")
        case "21_TO_30" => messages("21_TO_30")
        case "31_TO_50" => messages("31_TO_50")
        case "MORE_THAN_50" => messages("MORE_THAN_50")
        case _  => "Invalid duration"
      }
      duration.periods = periodTranslated
    }
    durations
  }
  def getConsCommPerOrganization()(implicit messages: Messages): List[model.dtos.CommPerConsPerOrganization] = {
    val evaluationRepository = new EvaluationRepository()
    var durations: List[model.dtos.CommPerConsPerOrganization] = Nil
    durations = evaluationRepository.getCommPerConsPerOrganization()
    for(duration <- durations) {
      val commentWindowTranslated = duration.commentWindow match {
        case "COMMENTS_LESS_THAN_20" => messages("COMMENTS_LESS_THAN_20")
        case "COMMENTS_21_TO_50" => messages("COMMENTS_21_TO_50")
        case "COMMENTS_51_TO_100" => messages("COMMENTS_51_TO_100")
        case "COMMENTS_101_TO_200" => messages("COMMENTS_101_TO_200")
        case "COMMENTS_201_TO_500" => messages("COMMENTS_201_TO_500")
        case "COMMENTS_501_TO_800" => messages("COMMENTS_501_TO_800")
        case "COMMENTS_MORE_THAN_800" => messages("COMMENTS_MORE_THAN_800")
        case _  => "Invalid duration"
      }
      duration.commentWindow = commentWindowTranslated
    }
    durations
  }
  def getConsultations(cons_ids:String): List[model.dtos.ConsultationForEvaluation] = {
    val evaluationRepository = new EvaluationRepository()
    var consultations: List[model.dtos.ConsultationForEvaluation] = Nil
    consultations = evaluationRepository.getConsultations(cons_ids)
    consultations
  }
}
