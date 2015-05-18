package democracit.model.viewmodels

/**
 * Created by alex on 17/4/2015.
 */
class HomeViewModel(val activeConsultations:List[democracit.dtos.Consultation],
                    val recentConsultations:List[democracit.dtos.Consultation],
                     val user: Option[model.User])
