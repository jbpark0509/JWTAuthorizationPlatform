export default function(g) {
    var it = g();
    return function() {
        return it.next.apply(it, arguments);
    }
}