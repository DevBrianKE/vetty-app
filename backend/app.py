from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(__name__)

# --- Database Config ---
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://vetty_user:password123@localhost:5432/vetty_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Import models after db is initialized
from models import User, Product, Order, OrderItem, Booking, Review


@app.shell_context_processor
def make_shell_context():
    return dict(
        db=db,
        User=User,
        Product=Product,
        Order=Order,
        OrderItem=OrderItem,
        Booking=Booking,
        Review=Review
    )

if __name__ == "__main__":
    app.run(debug=True)
