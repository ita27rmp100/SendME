if ($('#pw').text()!=$('#ConfirmPW').text()) {
    alert('Confirm your password please.')
}
let width_height = [
    {
        width:"350px",
        height:"230px"
    },
    {
        width:"50px",
        height:"50px"
    }
]
let change_mode = 0
function spread(){
    $("header").css(width_height[change_mode])
    change_mode = Math.abs(change_mode-1)
}