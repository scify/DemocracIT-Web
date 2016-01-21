package model.viewmodels

import model.dtos._

case class HomeViewModel(activeConsultations:List[Consultation],
                        recentConsultations:List[Consultation],
                         stats : PlatformStats,
                        user: Option[User])
