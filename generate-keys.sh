#!/bin/bash

# Navigate to the 'keys' folder in the home directory
cd config/keys

# Generate a 2048-bit RSA private key and save it to a file named 'private.pem'
openssl genrsa -out private.pem 2048

# Extract the public key from the private key and save it to a file named 'public.pem'
openssl rsa -in private.pem -outform PEM -pubout -out public.pem

# Grant premissions
chmod 777 -R .

# Print a message indicating that the keys were generated
echo "Private and public keys generated successfully"