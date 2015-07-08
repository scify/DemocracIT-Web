package model.dtos

case class PlatformStats(totalConsultations:Int,
                        medianAverageCommentsPerConsultations:Int,
                        medianAverageDaysPerConsultation:Int,
                        organizationsPerCategory:List[OrganizationStatsGrouped])



