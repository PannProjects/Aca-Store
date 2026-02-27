<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title inertia>AcaStore - Topup Game Amanah</title>
    <meta name="description" inertia content="AcaStore - Platform Topup Game Termurah dan Terpercaya di Indonesia. Diproses otomatis 24/7.">
    <meta property="og:title" inertia content="AcaStore - Topup Game Amanah">
    <meta property="og:image" inertia content="{{ asset('logo.webp') }}?v=2">
    <link rel="icon" type="image/webp" href="{{ asset('logo.webp') }}?v=2">
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700&display=swap" rel="stylesheet" />
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
</head>
<body class="font-sans antialiased">
    @inertia
</body>
</html>
