package utils

import javax.inject.Inject

import play.api.http.HttpFilters
import play.api.mvc.EssentialFilter
import play.filters.cors.CORSFilter

/**
 * Provides filters.
 */
//class Filters @Inject() (csrfFilter: play.filters.csrf.CSRFFilter, securityHeadersFilter: SecurityHeadersFilter) extends HttpFilters {
class Filters @Inject() (csrfFilter: play.filters.csrf.CSRFFilter, corsFilter: CORSFilter) extends HttpFilters {
  override def filters: Seq[EssentialFilter] = Seq(csrfFilter, corsFilter) //, securityHeadersFilter
}
