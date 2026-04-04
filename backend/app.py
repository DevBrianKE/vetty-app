from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask import jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
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


@app.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    # Convert each product to a dictionary
    products_list = []
    for p in products:
        products_list.append({
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "price": float(p.price),
            "stock": p.stock
        })
    return jsonify(products_list)

@app.route('/products/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get(id)

    if not product:
        return jsonify({"error": "Product not found"}), 404

    return jsonify({
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": float(product.price),
        "stock": product.stock,
        "image_url": product.image_url
    })

from flask import request

@app.route('/bookings', methods=['POST'])
def create_booking():
    data = request.get_json()

    try:
        new_booking = Booking(
            user_id=1,  # temporary (we don't have auth yet)
            service_id=data.get("service_id"),
            date=data.get("date"),
            status="pending"
        )

        db.session.add(new_booking)
        db.session.commit()

        return jsonify({"message": "Booking created successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)

