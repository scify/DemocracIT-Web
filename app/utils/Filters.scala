package utils

import javax.inject.Inject

import play.api.http.HttpFilters
import play.api.mvc.EssentialFilter

/**
 * Provides filters.
 */
//class Filters @Inject() (csrfFilter: play.filters.csrf.CSRFFilter, securityHeadersFilter: SecurityHeadersFilter) extends HttpFilters {
class Filters @Inject() (csrfFilter: play.filters.csrf.CSRFFilter) extends HttpFilters {
  override def filters: Seq[EssentialFilter] = Seq(csrfFilter) //, securityHeadersFilter

}
