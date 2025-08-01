import bcrypt

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# Generate hashes for the pre-created accounts
passwords = {
    'SAdmin': '12345qwerty',
    'Manager1': 'manager123',
    'User1': 'user123'
}

print("Password hashes for database:")
print("=" * 50)

for username, password in passwords.items():
    hashed = hash_password(password)
    print(f"Username: {username}")
    print(f"Password: {password}")
    print(f"Hash: {hashed}")
    print("-" * 30) 