package model.services
import model.dtos._
import model.repositories._

/**
 * Created by alex on 24/2/2015.
 */
class AccountManager {

  def login(emailAddress: String, password:String) = {  }

  def register(emailAddress:String,password:String) = {  }

  def resetPassword(emailAddress:String) = {}

  def confirmResetPassword(token: String, password: String) = {}

}
