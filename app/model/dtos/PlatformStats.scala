package model.dtos

case class PlatformStats(val totalConsultations:Int,
                        val medianAverageCommentsPerConsultations:Int,
                        val medianAverageDaysPerConsultation:Int,
                        val organizationsPerCategory:List[OrganizationStatsGrouped])



