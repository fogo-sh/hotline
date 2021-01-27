require "uuid"
require "log"

require "kemal"

abstract class Connection
  getter socket : HTTP::WebSocket
  getter context : HTTP::Server::Context
  getter uuid : UUID = UUID.random
  getter open : Bool
  getter metadata : String

  def initialize(@socket, @context)
    @open = true
    @metadata = JSON.build do |json|
      json.object do
        json.field "headers", @context.request.headers.to_a
        json.field "remote", @context.request.remote_address.to_s
      end
    end

    @socket.on_message do |message|
      handle_message(message)
    end

    @socket.on_close do |_|
      handle_close
    end
  end

  abstract def handle_message(message : String)
  abstract def handle_close()
end

class Client < Connection
  class_property collection : Hash(UUID, Client) = Hash(UUID, Client).new

  getter messages : Array(String) = [] of String
  getter label : String?

  def initialize(@socket, @context)
    super(@socket, @context)
    Log.info { "Client initalizing: #{@uuid}" }
    Client.collection[@uuid] = self
  end

  def handle_message(message)
    messages << message
    Log.info { "Client message ##{messages.size} from #{@uuid}: #{message}" }
  end

  def handle_close()
    Log.info { "Client closing: #{@uuid}" }
    @open = false
  end
end

class Admin < Connection
  class_property collection : Hash(UUID, Admin) = Hash(UUID, Admin).new

  def initialize(@socket, @context)
    super(@socket, @context)
    Log.info { "Admin initalizing: #{@uuid}" }
    Admin.collection[@uuid] = self
  end

  def handle_message(message)
    Log.info { "Admin message from #{@uuid}: #{message}" }
  end

  def handle_close()
    Log.info { "Admin closing: #{@uuid}" }
    @open = false
  end
end

ws "/" do |socket, context|
  client = Client.new(socket, context)
end

post "/admin" do |env|
  password = env.params.json["password"].as(String)
  puts password
end

ws "/admin" do |socket, context|
  # TODO auth
  admin = Admin.new(socket, context)
end

Kemal.run(4000)
