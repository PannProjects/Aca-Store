<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Invoice #{{ $transaksi->id }} - BerkahStore</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 12px; color: #333; padding: 20px; }
        
        .header { border-bottom: 2px solid #0d9488; padding-bottom: 15px; margin-bottom: 20px; }
        .header table { width: 100%; }
        .logo { font-size: 20px; font-weight: bold; color: #0d9488; }
        .logo span { color: #f59e0b; }
        .tagline { font-size: 10px; color: #666; }
        .invoice-title { text-align: right; }
        .invoice-title h2 { font-size: 18px; color: #0d9488; margin-bottom: 3px; }
        .invoice-title p { font-size: 10px; color: #666; }
        .badge { display: inline-block; background: #dcfce7; color: #15803d; padding: 2px 8px; border-radius: 10px; font-size: 9px; font-weight: bold; }
        
        .info-row { margin-bottom: 15px; }
        .info-row table { width: 100%; }
        .info-row td { width: 50%; vertical-align: top; padding: 10px; background: #f8fafc; }
        .info-row td:first-child { border-left: 3px solid #0d9488; }
        .info-row td:last-child { border-left: 3px solid #14b8a6; }
        .info-label { font-size: 9px; color: #0d9488; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
        .info-value { font-weight: bold; }
        .game-id { font-size: 14px; color: #0d9488; }
        
        .items { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        .items th { background: #0d9488; color: white; padding: 8px 10px; font-size: 10px; text-transform: uppercase; text-align: left; }
        .items th:last-child, .items td:last-child { text-align: right; }
        .items td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
        
        .total-section { text-align: right; margin-bottom: 15px; }
        .total-box { display: inline-block; background: #0d9488; color: white; padding: 10px 20px; border-radius: 5px; }
        .total-label { font-size: 10px; opacity: 0.9; }
        .total-amount { font-size: 16px; font-weight: bold; }
        
        .payment { background: #f0fdfa; border: 1px solid #0d9488; border-radius: 5px; padding: 10px; margin-bottom: 15px; }
        .payment-label { font-size: 9px; color: #0d9488; text-transform: uppercase; }
        .payment-method { font-weight: bold; text-transform: uppercase; }
        
        .footer { text-align: center; padding-top: 15px; border-top: 1px solid #e5e7eb; }
        .footer p { font-size: 10px; color: #999; }
        .footer .thanks { font-size: 12px; color: #0d9488; font-weight: bold; margin-bottom: 3px; }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <table>
            <tr>
                <td>
                    <div class="logo">Berkah<span>Store</span></div>
                    <div class="tagline">Topup Game Amanah & Terpercaya</div>
                </td>
                <td class="invoice-title">
                    <h2>INVOICE</h2>
                    <p>#{{ str_pad($transaksi->id, 5, '0', STR_PAD_LEFT) }} | {{ $transaksi->created_at->format('d M Y') }}</p>
                    <span class="badge">LUNAS</span>
                </td>
            </tr>
        </table>
    </div>
    
    <!-- Info Row -->
    <div class="info-row">
        <table cellspacing="10">
            <tr>
                <td>
                    <div class="info-label">Pembeli</div>
                    <div class="info-value">{{ $transaksi->user->name }}</div>
                    <div>{{ $transaksi->user->email }}</div>
                </td>
                <td>
                    <div class="info-label">Akun Game</div>
                    <div>User ID: <span class="game-id">{{ $transaksi->game_id }}</span></div>
                    <div>Server: <span class="game-id">{{ $transaksi->server_id }}</span></div>
                </td>
            </tr>
        </table>
    </div>
    
    <!-- Items -->
    <table class="items">
        <tr>
            <th>Produk</th>
            <th>Harga</th>
            <th>Qty</th>
            <th>Subtotal</th>
        </tr>
        <tr>
            <td><strong>{{ $transaksi->produk->nama }}</strong></td>
            <td>Rp {{ number_format($transaksi->produk->harga, 0, ',', '.') }}</td>
            <td>{{ $transaksi->kuantitas }}</td>
            <td><strong>Rp {{ number_format($transaksi->total_harga, 0, ',', '.') }}</strong></td>
        </tr>
    </table>
    
    <!-- Total -->
    <div class="total-section">
        <div class="total-box">
            <div class="total-label">Total Bayar</div>
            <div class="total-amount">Rp {{ number_format($transaksi->total_harga, 0, ',', '.') }}</div>
        </div>
    </div>
    
    <!-- Payment -->
    <div class="payment">
        <span class="payment-label">Metode Pembayaran: </span>
        <span class="payment-method">{{ str_replace('_', ' ', $transaksi->payment_method ?? 'Transfer') }}</span>
    </div>
    
    <!-- Footer -->
    <div class="footer">
        <p class="thanks">Terima kasih telah berbelanja di BerkahStore!</p>
        <p>Invoice ini sah tanpa tanda tangan.</p>
    </div>
</body>
</html>
