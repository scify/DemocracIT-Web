package model.viewmodels

import model.dtos._

case class HomeViewModel(val activeConsultations:List[Consultation],
                    val recentConsultations:List[Consultation],
                    val stats : PlatformStats,
                     val user: Option[model.User])
