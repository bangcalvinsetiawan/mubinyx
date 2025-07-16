@echo off
echo 🎨 Generating remaining Mubinyx flowchart images...
echo.

cd /d "c:\Users\chemc\Downloads\Telegram Desktop\Mubinyx\mubinyx"

echo 📊 Generating Wallet & Transaction Flow...
echo flowchart TD > temp-wallet-flow.mmd
echo     A[👤 User] --^> B[👛 Access Wallet] >> temp-wallet-flow.mmd
echo     B --^> C{Action Type?} >> temp-wallet-flow.mmd
echo     C --^>^|Deposit^| D[💰 Deposit Flow] >> temp-wallet-flow.mmd
echo     C --^>^|Withdraw^| E[💸 Withdrawal Flow] >> temp-wallet-flow.mmd
echo     C --^>^|Transfer^| F[🔄 Transfer Flow] >> temp-wallet-flow.mmd
echo.    >> temp-wallet-flow.mmd
echo     %%%% Deposit Flow >> temp-wallet-flow.mmd
echo     D --^> G{Payment Method?} >> temp-wallet-flow.mmd
echo     G --^>^|Bank Transfer^| H[🏦 Bank Deposit] >> temp-wallet-flow.mmd
echo     G --^>^|Crypto^| I[🪙 Crypto Deposit] >> temp-wallet-flow.mmd
echo.    >> temp-wallet-flow.mmd
echo     H --^> J[📝 Upload Proof] >> temp-wallet-flow.mmd
echo     J --^> K[⏳ Pending Verification] >> temp-wallet-flow.mmd
echo     K --^> L[👨‍💼 Admin Reviews] >> temp-wallet-flow.mmd
echo     L --^> M{Valid?} >> temp-wallet-flow.mmd
echo     M --^>^|Yes^| N[✅ Balance Updated] >> temp-wallet-flow.mmd
echo     M --^>^|No^| O[❌ Rejected] >> temp-wallet-flow.mmd
echo.    >> temp-wallet-flow.mmd
echo     I --^> P[🔗 Generate Crypto Address] >> temp-wallet-flow.mmd
echo     P --^> Q[📱 User Sends Crypto] >> temp-wallet-flow.mmd
echo     Q --^> R[🔄 Blockchain Confirmation] >> temp-wallet-flow.mmd
echo     R --^> S{Confirmed?} >> temp-wallet-flow.mmd
echo     S --^>^|Yes^| N >> temp-wallet-flow.mmd
echo     S --^>^|No^| T[⏳ Wait for Confirmations] >> temp-wallet-flow.mmd
echo     T --^> R >> temp-wallet-flow.mmd
echo.    >> temp-wallet-flow.mmd
echo     %%%% Withdrawal Flow >> temp-wallet-flow.mmd
echo     E --^> U{KYC Verified?} >> temp-wallet-flow.mmd
echo     U --^>^|No^| V[❌ KYC Required] >> temp-wallet-flow.mmd
echo     U --^>^|Yes^| W[💸 Enter Amount] >> temp-wallet-flow.mmd
echo     W --^> X{Sufficient Balance?} >> temp-wallet-flow.mmd
echo     X --^>^|No^| Y[❌ Insufficient Funds] >> temp-wallet-flow.mmd
echo     X --^>^|Yes^| Z[📝 Withdrawal Request] >> temp-wallet-flow.mmd
echo     Z --^> AA[👨‍💼 Admin Approval] >> temp-wallet-flow.mmd
echo     AA --^> BB{Approved?} >> temp-wallet-flow.mmd
echo     BB --^>^|Yes^| CC[💰 Process Payment] >> temp-wallet-flow.mmd
echo     BB --^>^|No^| DD[❌ Request Rejected] >> temp-wallet-flow.mmd
echo     CC --^> EE[✅ Withdrawal Complete] >> temp-wallet-flow.mmd

mmdc -i temp-wallet-flow.mmd -o ./flowchart-images/wallet-transaction-flow.png -t dark -b white
del temp-wallet-flow.mmd

echo ✅ Generated wallet-transaction-flow.png
echo.

echo 📊 Generating Admin Transaction Approval Flow...
echo flowchart TD > temp-admin-flow.mmd
echo     A[👨‍💼 Admin] --^> B[📋 View Pending Transactions] >> temp-admin-flow.mmd
echo     B --^> C[🔍 Review Transaction Details] >> temp-admin-flow.mmd
echo     C --^> D[👤 Check User Information] >> temp-admin-flow.mmd
echo     D --^> E[📄 Verify Documents] >> temp-admin-flow.mmd
echo     E --^> F{Transaction Valid?} >> temp-admin-flow.mmd
echo     F --^>^|No^| G[❌ Reject Transaction] >> temp-admin-flow.mmd
echo     F --^>^|Yes^| H[✅ Approve Transaction] >> temp-admin-flow.mmd
echo.    >> temp-admin-flow.mmd
echo     G --^> I[📝 Add Rejection Reason] >> temp-admin-flow.mmd
echo     I --^> J[📧 Notify User] >> temp-admin-flow.mmd
echo     J --^> K[💾 Update Transaction Status] >> temp-admin-flow.mmd
echo.    >> temp-admin-flow.mmd
echo     H --^> L[💰 Process Transaction] >> temp-admin-flow.mmd
echo     L --^> M[📧 Notify User] >> temp-admin-flow.mmd
echo     M --^> N[💾 Update Balances] >> temp-admin-flow.mmd
echo     N --^> O[📊 Generate Transaction Record] >> temp-admin-flow.mmd

mmdc -i temp-admin-flow.mmd -o ./flowchart-images/admin-transaction-approval.png -t dark -b white
del temp-admin-flow.mmd

echo ✅ Generated admin-transaction-approval.png
echo.

echo 📊 Generating Notification System Flow...
echo flowchart TD > temp-notification-flow.mmd
echo     A[🎯 System Event] --^> B{Event Type?} >> temp-notification-flow.mmd
echo     B --^>^|User Registration^| C[📧 Welcome Email] >> temp-notification-flow.mmd
echo     B --^>^|KYC Status^| D[📧 KYC Notification] >> temp-notification-flow.mmd
echo     B --^>^|Transaction^| E[📧 Transaction Alert] >> temp-notification-flow.mmd
echo     B --^>^|Investment^| F[📧 Investment Update] >> temp-notification-flow.mmd
echo     B --^>^|Security^| G[🔒 Security Alert] >> temp-notification-flow.mmd
echo.    >> temp-notification-flow.mmd
echo     C --^> H[💾 Save to Database] >> temp-notification-flow.mmd
echo     D --^> H >> temp-notification-flow.mmd
echo     E --^> H >> temp-notification-flow.mmd
echo     F --^> H >> temp-notification-flow.mmd
echo     G --^> H >> temp-notification-flow.mmd
echo.    >> temp-notification-flow.mmd
echo     H --^> I[📱 Push to User] >> temp-notification-flow.mmd
echo     I --^> J[🔔 In-App Notification] >> temp-notification-flow.mmd
echo     J --^> K{User Online?} >> temp-notification-flow.mmd
echo     K --^>^|Yes^| L[📲 Real-time Display] >> temp-notification-flow.mmd
echo     K --^>^|No^| M[💾 Queue for Later] >> temp-notification-flow.mmd

mmdc -i temp-notification-flow.mmd -o ./flowchart-images/notification-system.png -t dark -b white
del temp-notification-flow.mmd

echo ✅ Generated notification-system.png
echo.

echo 🎉 All flowchart images generated successfully!
echo 📁 Check the flowchart-images folder for all PNG files.
echo.
pause
