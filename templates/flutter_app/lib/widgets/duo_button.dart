import 'package:flutter/material.dart';

class Duo3DButton extends StatefulWidget {
  final String text;
  final VoidCallback? onPressed;
  final Color backgroundColor;
  final Color shadowColor;
  final Color textColor;
  final double height;
  final double? width;
  final IconData? icon;

  const Duo3DButton({
    Key? key,
    required this.text,
    required this.onPressed,
    this.backgroundColor = const Color(0xFF58CC02),
    this.shadowColor = const Color(0xFF58A700),
    this.textColor = Colors.white,
    this.height = 52.0,
    this.width,
    this.icon,
  }) : super(key: key);

  @override
  State<Duo3DButton> createState() => _Duo3DButtonState();
}

class _Duo3DButtonState extends State<Duo3DButton> {
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    final bool isEnabled = widget.onPressed != null;
    final Color effectiveBg = isEnabled ? widget.backgroundColor : const Color(0xFFE5E5E5);
    final Color effectiveShadow = isEnabled ? widget.shadowColor : const Color(0xFFD0D0D0);
    final Color effectiveText = isEnabled ? widget.textColor : const Color(0xFFAFAFAF);

    const double depth = 4.0;
    final double topMargin = _isPressed ? depth : 0.0;
    final double bottomMargin = _isPressed ? 0.0 : depth;

    return GestureDetector(
      onTapDown: isEnabled ? (_) => setState(() => _isPressed = true) : null,
      onTapUp: isEnabled
          ? (_) {
              setState(() => _isPressed = false);
              widget.onPressed?.call();
            }
          : null,
      onTapCancel: isEnabled ? () => setState(() => _isPressed = false) : null,
      child: Container(
        width: widget.width,
        height: widget.height,
        margin: EdgeInsets.only(top: topMargin, bottom: bottomMargin),
        decoration: BoxDecoration(
          color: effectiveBg,
          borderRadius: BorderRadius.circular(16.0),
          boxShadow: [
            if (!_isPressed)
              BoxShadow(
                color: effectiveShadow,
                offset: const Offset(0, depth),
                blurRadius: 0,
              ),
          ],
        ),
        alignment: Alignment.center,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (widget.icon != null) ...[
              Icon(widget.icon, color: effectiveText, size: 20),
              const SizedBox(width: 8),
            ],
            Text(
              widget.text,
              style: TextStyle(
                color: effectiveText,
                fontSize: 16,
                fontWeight: FontWeight.w900,
                letterSpacing: 0.8,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
