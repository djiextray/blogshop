function loadProvinsi(a) {
    $("#descity").hide(), $(a).html("loading..."), $.ajax({
        type: "GET",
        url: "https://files.themelate.com/api/location.php?act=showprovince",
        dataType: "jsonp",
        success: function(b) {
            $(a).html(""), province = "", $.each(b.rajaongkir.results, function(b, c) {
                province = '<option value="' + c.province_id + '">' + c.province + "</option>", province += "", $(a).append(province)
            })
        },
        error: function() {
            $(a).html("ERROR")
        }
    })
}

function loadCity(a, b) {
    $.ajax({
        type: "GET",
        url: "https://files.themelate.com/api/location.php?act=showcity",
        dataType: "jsonp",
        data: {
            province: a
        },
        success: function(a) {
            $(b).html(""), city = "", $.each(a.rajaongkir.results, function(a, c) {
                city = '<option value="' + c.city_id + '">' + c.city_name + "</option>", city += "", $(b).append(city)
            })
        },
        error: function() {
            $(b).html("ERROR")
        }
    })
}

function cekHarga() {
    var a = $("#pengiriman").val();
    if ("yes" == a) {
        var b = $("#oricity").val(),
            c = $("#descity").val(),
            d = $("#jumlah_berat").html(),
            e = 1;
        e = 0 == d ? 100 : 1e3 * parseFloat(d);
        var f = $("#ekspedisi").val(),
            g = $("#typepaket").val();
        if ($("#data-shipping").show(), $("#tableShip").hide(), $("#data-shipping").html("Checking Data.."), $("#ongkir").val("0"), simpleCart.updatePageElements(), "Kota / Kabupaten" != c) {
            var h = null;
            h = $.ajax({
                type: "GET",
                url: "https://files.themelate.com/api/location.php?act=cost",
                dataType: "jsonp",
                data: {
                    origin: b,
                    destination: c,
                    weight: e,
                    courier: f,
                    paket: g
                },
                beforeSend: function() {
                    null != h && h.abort()
                },
                success: function(a) {
                    console.log(a), $("#data-shipping").html("Choose your courier"), $("#resultShip").html(""), ongkir = "", $.each(a.data, function(a, b) {
                        "allpackage" == g ? (ongkir = "<tr><td><input type='radio' name='paket' id='servis" + b.paket + "' value='" + b.paket + "|" + b.estimasi + "' onclick='choosePaket(" + b.harga + ", this.value)'><label for='servis" + b.paket + "'>" + b.paket + "</label></td><td class='tb-desc'><label for='servis" + b.paket + "'>" + b.deskripsi + "</label></td><td><label for='servis" + b.paket + "'>" + b.estimasi + "</label></td><td><label for='servis" + b.paket + "'>" + b.tharga + "</label></td></tr>", $("#resultShip").append(ongkir), $("#tableShip").show()) : ($("#tableShip").hide(), choosePaket(b.harga, b.paket + "|" + b.estimasi), $("#data-shipping").html("<b>" + f.toUpperCase() + "</b> - " + b.deskripsi), $("#data-shipping").show())
                    }), "" == ongkir && ($("#data-shipping").html("<span style='color:#aaa'>Data not found!</span>"), $("#data-shipping").show())
                },
                error: function() {
                    $("#data-shipping").html("ERROR")
                }
            })
        }
    }
}

function choosePaket(a, b) {
    $("#ongkir").val(a);
    var c, d = $("#ekspedisi").val(),
        e = b.split("|");
    c = "" == e[1] ? "" : " - Estimasi " + e[1] + " hari", $("[name='smanagerekspedisi']").val("<b>" + d.toUpperCase() + "</b> - " + e[0] + c);
    var f = $("#textprovinsi").val(),
        g = $("#textkota").val();
    $("[name='smanagerkekota']").val("<b>" + g + "</b>, " + f), simpleCart.updatePageElements()
}

function makepay() {
    var a = $("#paypal_cur").val(),
        b = document.createElement("form");
    b.setAttribute("method", "post"), b.setAttribute("action", "https://www.paypal.com/cgi-bin/webscr?cmd=_cart&upload=1&currency_code=" + a + "&no_note=1"), b.setAttribute("name", "paynow");
    var c = $("#paypal").val(),
        d = document.createElement("input");
    d.setAttribute("type", "hidden"), d.setAttribute("name", "business"), d.setAttribute("value", c), b.appendChild(d);
    var e = window.location.href,
        f = document.createElement("input");
    f.setAttribute("type", "hidden"), f.setAttribute("name", "return"), f.setAttribute("value", e), b.appendChild(f);
    for (var g = $("#mycart .itemContainer .itemName"), h = $("#mycart .itemContainer .itemPrice"), i = $("#mycart .itemContainer .itemQuantity [type='number']"), j = 0; j < g.length; ++j) {
        var k = g[j],
            l = k.innerHTML,
            m = l.replace("<b>", " "),
            n = m.replace("</b>", " "),
            o = n.replace("<br>", " || "),
            p = o.replace("<br>", " || "),
            q = h[j],
            r = q.innerHTML,
            s = r.replace(/[^0-9.]/g, ""),
            t = i[j],
            u = t.value,
            v = document.createElement("input");
        v.setAttribute("type", "hidden"), v.setAttribute("name", "item_name_" + (j + 1)), v.setAttribute("value", p), b.appendChild(v);
        var w = document.createElement("input");
        w.setAttribute("type", "hidden"), w.setAttribute("name", "amount_" + (j + 1)), w.setAttribute("value", s), b.appendChild(w);
        var x = document.createElement("input");
        x.setAttribute("type", "hidden"), x.setAttribute("name", "quantity_" + (j + 1)), x.setAttribute("value", u), b.appendChild(x)
    }
    var y = document.createElement("input");
    y.setAttribute("type", "hidden"), y.setAttribute("name", "item_name_" + (j + 1)), y.setAttribute("value", "Shipping Cost"), b.appendChild(y);
    var z = $("#ongkir").val(),
        A = document.createElement("input");
    A.setAttribute("type", "hidden"), A.setAttribute("name", "amount_" + (j + 1)), A.setAttribute("value", z), b.appendChild(A), document.getElementsByTagName("body")[0].appendChild(b), document.paynow.submit()
}

function scs(a) {
    $("#pembayaran").show(), $("#pemesanan").hide(), $("#shipping").hide(), $("#mycart").hide(), "bank" == a ? (simpleCart.empty(), $("#payment-bank-transfer").show(), $("#payment-cod").hide(), $("#payment-paypal").hide()) : "cod" == a ? (simpleCart.empty(), $("#payment-bank-transfer").hide(), $("#payment-cod").show(), $("#payment-paypal").hide()) : "paypal" == a && ($("#payment-bank-transfer").hide(), $("#payment-cod").hide(), $("#payment-paypal").show(), makepay(), simpleCart.empty())
}

function opensucces() {
    var a = {};
    if (document.location.toString().indexOf("?") !== -1)
        for (var b = document.location.toString().replace(/^.*?\?/, "").replace(/#.*$/, "").split("&"), c = 0, d = b.length; c < d; c++) {
            var e = decodeURIComponent(b[c]).split("=");
            a[e[0]] = e[1]
        }
    "do" == a.success ? scs() : "not" == a.success && alert("Invoice not send!")
}

function shopping_cart(a) {
    if ("mycart" == a) $("#mycart").show(), $("#shipping").hide(), $("#pemesanan").hide(), $("#pembayaran").hide();
    else if ("shipping" == a) {
        var b = $("#pengiriman").val();
        if ("yes" == b) {
            var c = document.getElementById("jumlah_item");
            "0" == c.innerHTML ? alert("Your cart is empty!") : ($("#mycart").hide(), $("#shipping").show(), $("#pemesanan").hide(), $("#pembayaran").hide())
        } else {
            var c = document.getElementById("jumlah_item");
            if ("0" == c.innerHTML) alert("Your cart is empty!");
            else {
                $("#pemesanan").is(":visible") ? ($("#mycart").show(), $("#pembayaran").hide(), $("#shipping").hide(), $("#pemesanan").hide()) : ($("#mycart").hide(), $("#pembayaran").hide(), $("#shipping").hide(), $("#pemesanan").show());
                var d = document.getElementById("tableCart"),
                    e = document.getElementById("tableTotal"),
                    f = document.getElementById("cart-payment"),
                    g = document.getElementById("cart_total");
                $("[name='smanagerisicart']").val(d.innerHTML + e.innerHTML), $("[name='smanagerpaymin']").val(f.innerHTML), $("[name='smanagertotal']").val(g.innerHTML), pathArray = window.location.href.split("/"), protocol = pathArray[0], host = pathArray[2], url = protocol + "//" + host, $("[name='smanagerurltoko']").val(url), $("#pemesanan").show(), $("#shipping").hide(), $("#mycart").hide(), $("#pembayaran").hide()
            }
        }
    } else if ("pemesanan" == a) {
        var c = document.getElementById("jumlah_item"),
            h = document.getElementById("ongkir");
        if ("0" == c.innerHTML) alert("Your cart is empty!");
        else if ("0" == h.value) alert("Please select your courier!");
        else {
            var d = document.getElementById("tableCart"),
                e = document.getElementById("tableTotal"),
                f = document.getElementById("cart-payment"),
                g = document.getElementById("cart_total");
            $("[name='smanagerisicart']").val(d.innerHTML + e.innerHTML), $("[name='smanagerpaymin']").val(f.innerHTML), $("[name='smanagertotal']").val(g.innerHTML), pathArray = window.location.href.split("/"), protocol = pathArray[0], host = pathArray[2], url = protocol + "//" + host, $("[name='smanagerurltoko']").val(url), $("#pemesanan").show(), $("#shipping").hide(), $("#mycart").hide(), $("#pembayaran").hide()
        }
    }
}
function cekAdd() {
    var projector, printer, kamera, tas, kaos, addit;
    //projector
    if(document.getElementById('projector').checked) {
        projector = "Projector, ";
    } else {
        projector = "";
    }
    //printer
    if(document.getElementById('printer').checked) {
        printer = "Printer, ";
    } else {
        printer = "";
    }
    //kamera
    if(document.getElementById('kamera').checked) {
        kamera = "Kamera, ";
    } else {
        kamera = "";
    }
    //tas
    if(document.getElementById('tas').checked) {
        tas = "Tas, ";
    } else {
        tas = "";
    }
    //kaos
    if(document.getElementById('kaos').checked) {
        kaos = "Kaos, ";
    } else {
        kaos = "";
    }
    addit = projector+printer+kamera+tas+kaos;
    $("[name='smanageraddit']").val(addit);
}
function updateTab() {
    var d = document.getElementById("tableCart"),
        e = document.getElementById("tableTotal");
    $("[name='smanagerisicart']").val(d.innerHTML + e.innerHTML);
}

function selectpay(a) {
    "bank" == a ? ($(".payment-value").hide(), $("#val-bank").show()) : "cod" == a ? ($(".payment-value").hide(), $("#val-cod").show()) : "paypal" == a && ($(".payment-value").hide(), $("#val-paypal").show())
}
$(document).ready(function() {
    loadProvinsi("#desprovince"), $("#desprovince").change(function() {
        $("#descity").show(), $("#descity").html("<option>Kota / Kabupaten</option>");
        var a = $("#desprovince").val();
        loadCity(a, "#descity")
    });
}), $(document).ready(function() {
    opensucces(), $("#shopping_cart_form_biasa").submit(function(a) {
        a.preventDefault(), $("#loading-process").show();
        var b = $("[name='smanagertypemark']").val(),
            c = $("[name='smanagertypecart']").val(),
            d = $("[name='smanagertotal']").val(),
            e = currency,
            f = cartEmail,
            g = $("[name='smanagerisicart']").val(),
            h = $("[name='smanagerongkir']").val(),
            i = $("[name='smanagerdarikota']").val(),
            j = $("[name='smanagerkekota']").val(),
            k = $("[name='smanagerekspedisi']").val(),
            l = $("[name='smanagerpaymin']").val(),
            m = $("[name='smanagerlanguage']").val(),
            n = $("[name='smanagertitel']").val(),
            o = $("[name='smanagerlogo']").val(),
            p = $("[name='smanageraddress']").val(),
            q = $("[name='smanagersurel']").val(),
            r = $("[name='smanagernami']").val(),
            s = $("[name='smanagerhenpon']").val(),
            t = $("[name='smanagergriyo']").val(),
            u = $("[name='smanagerpostal']").val(),
            v = $("[name='smanagermsg']").val(),
            w = $("[name='smanagerurl']").val(),
            x = $("#pengiriman").val(),
            aa = $("[name='smanagerdate']").val(),
            ab = $("[name='smanagerinap']").val(),
            ac = $("[name='smanagerinstansi']").val(),
            ad = $("[name='smanageraddit']").val();
        country = $("[name='smanagercountry']").val(), city = $("[name='smanagercity']").val(), method = $("[name='smanagermethod']:checked").val(), paypal = $("[name='smanagerpaypal']").val(), $.ajax({
            url: "https://files.themelate.com/indomeeting.php?from=ajax",
            type: "POST",
            data: {
                smanagertypemark: b,
                smanagertypecart: c,
                smanagertotal: d,
                smanageremail: f,
                smanagercurrency: e,
                smanagerisicart: g,
                smanagerongkir: h,
                smanagerdarikota: i,
                smanagerkekota: j,
                smanagerekspedisi: k,
                smanagerpaymin: l,
                smanagerlanguage: m,
                smanagertitel: n,
                smanagerlogo: o,
                smanageraddress: p,
                smanagersurel: q,
                smanagernami: r,
                smanagerhenpon: s,
                smanagergriyo: t,
                smanagerpostal: u,
                smanagermsg: v,
                smanagerurl: w,
                cekongkir: x,
                smanagerdate : aa,
                smanagerinap : ab,
                smanagerinstansi : ac,
                smanageraddit : ad,
                smanagercountry: country,
                smanagercity: city,
                smanagermethod: method,
                smanagerpaypal: paypal
            },
            success: function(a, b) {
                $("#loading-process").hide(), response = a.split("|"), '"1' == response[0] ? scs(method) : alert(response[1])
            },
            error: function(a) {
                console.log(a)
            }
        })
    })
});
