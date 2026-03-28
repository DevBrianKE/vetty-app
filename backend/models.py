from app import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)  # Unique user ID
    username = db.Column(db.String(50), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='user')  # 'user' or 'admin'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    orders = db.relationship('Order', backref='user', lazy=True)
    bookings = db.relationship('Booking', backref='user', lazy=True)
    reviews = db.relationship('Review', backref='user', lazy=True)

    def __repr__(self):
        return f"<User {self.username}>"

class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    stock = db.Column(db.Integer, nullable=False, default=0)
    image_url = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    order_items = db.relationship('OrderItem', backref='product', lazy=True)
    reviews = db.relationship('Review', backref='product', lazy=True)

    def __repr__(self):
        return f"<Product {self.name}>"
    
class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    total_amount = db.Column(db.Numeric(10,2), nullable=False)
    status = db.Column(db.String(50), default='Pending')  # Pending, Approved, Delivered
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    order_items = db.relationship('OrderItem', backref='order', lazy=True)

    def __repr__(self):
        return f"<Order {self.id} - User {self.user_id}>"

