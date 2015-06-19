package model.dtos

case class PlatformStats(val totalConsultations:Int,
                        val averageCommentsPerConsultations:Int,
                        val averageDaysPerConsultation:Int,
                        val organizationsPerCategory:List[OrganizationStatsGrouped])



