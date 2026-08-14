# Dqplatforms
<!DOCTYPE html>
<html lang="az">
<head>
    <meta charset="UTF-8">
    <title>İmtahan Sistemi</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; display: flex; justify-content: center; }
        .container { display: flex; width: 900px; background: white; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); overflow: hidden; }
        .main-content { flex: 3; padding: 30px; border-right: 1px solid #ddd; }
        .sidebar { flex: 1; background: #f8f9fa; padding: 20px; }
        .question-title { font-size: 18px; font-weight: bold; margin-bottom: 20px; }
        .option { display: block; background: #fff; border: 1px solid #ccc; padding: 12px; margin-bottom: 10px; border-radius: 5px; cursor: pointer; transition: 0.2s; }
        .option:hover { background: #f1f1f1; }
        .nav-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-top: 15px; }
        .nav-btn { padding: 10px; text-align: center; background: #e9ecef; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
        .nav-btn.active { background: #007bff; color: white; }
        .finish-btn { width: 100%; background: #007bff; color: white; border: none; padding: 12px; border-radius: 5px; cursor: pointer; font-weight: bold; margin-top: 20px; }
        .finish-btn:hover { background: #0056b3; }
    </style>
</head>
<body>

<div class="container">
    <div class="main-content">
        <div id="question-number" style="color: #6c757d; font-size: 14px; margin-bottom: 5px;">Sual nömrəsi 1</div>
        <div class="question-title" id="question-text">"Məhkəmələr və hakimlər haqqında" Azərbaycan Respublikasının Qanununa əsasən yanlışdır:</div>
        
        <div id="options-container">
            <label class="option"><input type="radio" name="opt"> Azərbaycan Respublikası Konstitusiya Məhkəməsinin statusu və fəaliyyəti...</label>
            <label class="option"><input type="radio" name="opt"> Azərbaycan Respublikası məhkəmələrinin fəaliyyəti yalnız adət məhkəməsi...</label>
            <label class="option"><input type="radio" name="opt"> Məhkəmələrin üzərinə "Məhkəmələr və hakimlər haqqında" Qanunla vəzifələr qoyula bilər.</label>
        </div>
    </div>

    <div class="sidebar">
        <h3>Sualların naviqasiyası</h3>
        <div class="nav-grid">
            <button class="nav-btn active">1</button>
            <button class="nav-btn">2</button>
            <button class="nav-btn">3</button>
            <button class="nav-btn">4</button>
            <button class="nav-btn">5</button>
        </div>
        <button class="finish-btn">İmtahanı bitir</button>
    </div>
</div>

</body>
</html>
