package utils

import javax.inject.Inject

import play.api.http.HttpFilters
import play.api.mvc.EssentialFilter
import play.filters.csrf.CSRFFilter
import play.filters.csrf.CSRFFilter
import play.filters.headers.SecurityHeadersFilter
import play.filters.headers.SecurityHeadersFilter

/**
 * Provides filters.
 */
//class Filters @Inject() (csrfFilter: play.filters.csrf.CSRFFilter, securityHeadersFilter: SecurityHeadersFilter) extends HttpFilters {
class Filters @Inject() (csrfFilter: play.filters.csrf.CSRFFilter) extends HttpFilters {
  override def filters: Seq[EssentialFilter] = Seq(csrfFilter) //, securityHeadersFilter
}
